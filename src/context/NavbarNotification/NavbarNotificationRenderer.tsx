import React, { useContext } from 'react'
import { NavbarNotificationContext } from './NavbarNotificationContext'

export default function NavbarNotificationRenderer() {
    const context = useContext(NavbarNotificationContext);

    return (
        <>
            {context.notifications.map((n) => (
                <React.Fragment key={n.ID}>{n.element}</React.Fragment>
            ))}
        </>
    );
}