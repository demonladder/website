import serverIP from "../serverIP";

async function byName(name, chunk = 5) {
    return fetch(`${serverIP}/getLevels?name=${name}&chunk=${chunk}`, {
        credentials: 'include'
    }).then(res => {
        return res.json();
    }).catch(e => { throw new Error('Couldn\'t connect to the server!'); });
}

async function byPack(name, id, chunk = 5) {
    return fetch(`${serverIP}/getPack?packID=${id}`, {
        credentials: 'include'
    }).then(res => res.json()).then(levels => {
        return levels.Levels.filter(l => l.Name.startsWith(name));
    })
    .catch(e => {});
}

const FetchLevels = {
    byName,
    byPack
};

export default FetchLevels;