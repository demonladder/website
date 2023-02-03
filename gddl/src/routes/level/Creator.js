import React from 'react';
import { Link } from 'react-router-dom';

export default function Creator({ name }) {
    return (
        <Link to='/'>{name}</Link>
    )
}