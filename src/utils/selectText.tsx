export function selectText(e: React.MouseEvent) {
    const range = document.createRange();
    range.selectNodeContents(e.currentTarget as Node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
}
