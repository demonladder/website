export class KeyboardAccessibility {
    static onSelect(eventHandler: (e: React.KeyboardEvent) => void) {
        return (e: React.KeyboardEvent) => {
            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                eventHandler(e);
            }
        };
    }
}
