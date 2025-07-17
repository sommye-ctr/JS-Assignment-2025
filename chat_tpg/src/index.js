import {API_URL, MODELS_LIST, MODELS_LIST as modelsList} from "./constants.js";
import {createItem, getItems, initDB, Prompt, updateChat} from "./localdb.js";
/* global marked */

const root = document.getElementById("root")
let selectedModel = MODELS_LIST[0];
let chats = [];
let currentChatId = -1;

const createDiv = () => document.createElement("div");
const scrollBottomChatArea = (chatArea) => requestAnimationFrame(() => {
    chatArea.scrollTop = chatArea.scrollHeight;
});
const createChatEnd = (innerChild) => {
    const outer = createDiv();
    outer.classList.add("chat", "chat-start");
    const inner = createDiv();
    inner.classList.add("chat-bubble");
    inner.appendChild(innerChild);
    outer.appendChild(inner);
    return outer;
}
const showLoading = () => {
    const loadingIcon = document.createElement("span");
    loadingIcon.classList.add("loading", 'loading-dots', 'loading-md');
    const load = createChatEnd(loadingIcon);
    load.id = "loading";
    return load;
}
const dismissLoading = () => {
    const loading = document.getElementById("loading");
    if (loading) {
        loading.remove();
    }
}
const toggleTextArea = () => {
    const chatInput = document.getElementById("chatInput");
    if (!chatInput) {
        console.error("Chat input not found");
        return;
    }
    chatInput.disabled = !chatInput.disabled;
}
const disableModelSelection = () => {
    const select = document.getElementById("modelSelection");
    if (!select) {
        console.error("Model select not found");
        return;
    }
    select.disabled = true;
    select.value = selectedModel;
}

const populateModels = () => {
    const select = document.getElementById("modelSelection");
    if (!select) {
        console.error("Model select not found");
        return;
    }

    modelsList.forEach(model => {
        const option = document.createElement(`option`);
        option.value = model;
        option.textContent = model;
        select.appendChild(option);
    })
    select.children[0].selected = true;
    select.value = modelsList[0];
}

const loadTemplate = (templateId) => {
    const temp = document.getElementById(templateId);
    if (temp && temp.content) {
        root.replaceChildren(temp.content.cloneNode(true));
    } else {
        console.error(`Template not found ${templateId}`);
        return;
    }

    if (templateId === "chat") populateModels();
}

const addPromptToDom = (input, chatArea) => {
    const outer = createDiv();
    outer.classList.add("chat", "chat-end");
    const inner = createDiv();
    inner.classList.add("chat-bubble");
    inner.textContent = input;
    outer.appendChild(inner);
    chatArea.prepend(outer);
}

const addResponseToDom = (response, chatArea) => {
    const para = createDiv()
    para.classList.add("leading-loose");
    para.innerHTML = marked.parse(response);

    const o = createChatEnd(para);
    chatArea.prepend(o);
}

const addUserPrompt = (input) => {
    const chatArea = document.getElementById("chatArea");
    if (!chatArea) {
        console.error("Chat area not found");
        return;
    }
    // Adding this prompt from user
    addPromptToDom(input, chatArea);
    disableModelSelection();
    toggleTextArea();

    //Adding loading icon from ai
    chatArea.prepend(showLoading());

    fetchResponse(input).then(async (r) => {
        if (r) {
            dismissLoading();
            addResponseToDom(r, chatArea);
            scrollBottomChatArea(chatArea);
            toggleTextArea();

            if (currentChatId < 0) {
                await addChatHistory(
                    [new Prompt(input, r)],
                    selectedModel
                );
            } else {
                await addPromptToChat(input, r);
            }

        }
    });
}

const populatePrompts = (id) => {
    const chatArea = document.getElementById("chatArea");
    if (!chatArea) {
        console.error("Chat area not found");
        return;
    }

    chatArea.replaceChildren();
    currentChatId = Number(id);
    const c = chats.find(chat => chat['id'] === currentChatId);

    selectedModel = c['model'];
    const prompts = c['prompts'];
    prompts.forEach(prompt => {
        addPromptToDom(prompt.message, chatArea);
        addResponseToDom(prompt.response, chatArea);
    })
    scrollBottomChatArea(chatArea);
    disableModelSelection();
}

const renderChatHistory = () => {
    const chatHistory = document.getElementById("chatHistory");
    if (!chatHistory) {
        console.error("Chat history not found");
        return;
    }

    chatHistory.replaceChildren();

    chats.forEach(chat => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("chatLink", "hover:bg-base-100");
        a.id = `chat-${chat.id}`;
        a.textContent = chat.prompts[0].message;
        li.appendChild(a);
        chatHistory.appendChild(li);
    });

    if (currentChatId >= 0) {
        document.getElementById(`chat-${currentChatId}`).classList.add("bg-base-100");
    }
}

const fetchResponse = async (input) => {
    try {
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    model: selectedModel,
                    message: input,
                })
            }
        );

        if (response.status !== 200) {
            console.error(`Error in response ${response.status}`);
            return;
        }
        const data = await response.json();
        return data['response'];
    } catch (e) {
        console.error(e);
    }
}

const addChatHistory = async (prompts, model) => {
    try {
        const added = await createItem(prompts, model);
        currentChatId = added.id;

        await refreshChatHistory();
        console.log("Item added:", added);
    } catch (e) {
        console.error(e);
    }
}

const refreshChatHistory = async () => {
    try {
        chats = await getItems();
        renderChatHistory();
        console.log("Items:", chats);
    } catch (e) {
        console.error(e);
    }
}

const addPromptToChat = async (input, response) => {
    try {
        const prompt = new Prompt(input, response);
        const chat = chats.find(chat => chat['id'] === currentChatId);
        chat.prompts.push(prompt);
        await updateChat(chat);
    } catch (e) {
        console.error(e);
    }
}

root.addEventListener("click", async (e) => {
        if (e.target.id === "getStartedBtn") {
            loadTemplate("chat");
            await refreshChatHistory();
        } else if (e.target.classList.contains("chatLink") && e.target.id !== currentChatId.toString()) {
            const clickedChatId = Number(e.target.id.split('-')[1]);

            if (clickedChatId !== currentChatId) {
                // removing selected bg from prev selection
                if (currentChatId >= 0) {
                    const prevSelectedChatLink = document.getElementById(`chat-${currentChatId}`);
                    if (prevSelectedChatLink) {
                        prevSelectedChatLink.classList.remove("bg-base-100");
                    }
                }

                e.target.classList.add("bg-base-100");
                populatePrompts(clickedChatId);
            }
        }
    }
)
root.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "chatInput" && e.target.value.length > 0) {
        e.preventDefault();
        addUserPrompt(e.target.value);
        e.target.value = "";
    }
})
root.addEventListener("change", (e) => {
    if (e.target.id === "modelSelection") {
        selectedModel = e.target.value;
    }
})
document.addEventListener("DOMContentLoaded", async () => {
    loadTemplate("getStarted");

    try {
        await initDB();
        console.log("Database initialized");
    } catch (e) {
        console.error(e);
    }
})

marked.setOptions({
    gfm: true, // Use GitHub Flavored Markdown (tables, task lists, etc.)
    breaks: true, // Render `\n` as `<br>`
    sanitize: true, // **IMPORTANT FOR SECURITY:** Sanitize the output HTML to prevent XSS attacks.
});