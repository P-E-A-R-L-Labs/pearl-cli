import { chatThread } from ".chatThread.ts";

function main() {
    chatThread().catch(console.error);
}

main();