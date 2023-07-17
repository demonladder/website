export default function CreatePack() {
    return (
        <div>
            <h3 className='mb-3'>Create Pack</h3>
            <label>Pack name:</label>
            <input type='text' className='mb-2' />
            <label>Description:</label>
            <textarea rows={1} className='d-block' placeholder='-' />
            <button className='primary'>Create</button>
        </div>
    );
}