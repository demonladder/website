import serverIP from "../serverIP";

async function byName(name, chunk = 5) {
    return fetchTimeout(`${serverIP}/getLevels?name=${name}&chunk=${chunk}`)
    .then(res => res.json());
}

async function byPack(name, id) {
    return fetchTimeout(`${serverIP}/getPack?packID=${id}`)
    .then(res => res.json())
    .then(levels => levels.Levels.filter(l => l.Name.startsWith(name)));
}

function fetchTimeout(path, options = {}) {
    const { timeout = 5000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return fetch(path, {
        ...options,
        signal: controller.signal
    }).then(res => {
        clearTimeout(id);
        return res;
    });
}

const FetchLevels = {
    byName,
    byPack
};

export default FetchLevels;