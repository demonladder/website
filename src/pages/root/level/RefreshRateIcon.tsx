function refreshRateToColor(refreshRate: number) {
    if (refreshRate >= 360) return 360;
    if (refreshRate >= 240) return 240;
    if (refreshRate >= 144) return 144;
    if (refreshRate >= 120) return 120;
    if (refreshRate >= 75) return 75;
    return 60;
}

export default function RefreshRateIcon({ refreshRate }: { refreshRate: number }) {
    return (
        <b className={`flex items-center justify-center text-center py-2 w-12 round:rounded-e-md bg-refreshRate-${refreshRateToColor(refreshRate)}` + ((refreshRate < 360 && refreshRate >= 75) ? ' text-black' : '')}>{refreshRate}</b>
    );
}