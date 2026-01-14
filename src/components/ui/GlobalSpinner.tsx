export default function GlobalSpinner() {
    return (
        <div className='fixed inset-0 bg-black/35 grid place-items-center' style={{ zIndex: 100 }}>
            <i className='bx bx-loader-alt bx-spin text-9xl' />
        </div>
    );
}
