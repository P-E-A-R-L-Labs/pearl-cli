import { chatThread } from "./ai/langchain/chatThread";

function main() {
    chatThread().catch(console.error);
}

main();