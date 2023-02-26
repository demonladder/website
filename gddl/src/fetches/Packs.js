import serverIP from "../serverIP";

async function byName(name, chunk = 5) {
    return await fetch(`${serverIP}/getPacks?name=${name}&chunk=${chunk}`, {
        credentials: 'include'
    }).then(res => res.json())
    .catch(e => {
        throw new Error('Couldn\'t connect to the server!');
    });
}

async function byID(id) {
    return await fetch(`${serverIP}/getPack?packID=${id}`, {
        credentials: 'include'
    }).then(res => {
        return res.json();
    }).catch(e => {
        throw new Error('Couldn\'t connect to the server!');
    });
}

async function all() {
    return byName('', 200);
}

const FetchPacks = {
    byName,
    all,
    byID
};

export default FetchPacks;