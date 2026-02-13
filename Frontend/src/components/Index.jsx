import './css/Index.css';
export const Container = ({ children }) => {
    return (
        <>
            <div className='container'>
                {children}
            </div>
        </>
    )
};

export const onToggle = (
    open,
    setOpen,
    selector,
    hideClass = "hide",
    timeOut = 250
) => {
    const setUp = () => {
        const overlay = document.querySelector(selector);

        if (open) {
            setOpen(true);
            return;
        }

        if (overlay) overlay.classList.add(hideClass);
        setTimeout(() => {
            setOpen(false);
            if (overlay) overlay.classList.remove(hideClass);
        }, timeOut);
    }

    setUp();
};
