import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { GetPack } from '../../../../api/packs.js';
import LoadingSpinner from '../../../../components/LoadingSpinner.js';
import Level from '../../list/Level.js';

export default function PackOverview() {
    const packID = useParams().packID;
    const { status, data: pack } = useQuery({
        queryKey: ['packs', packID],
        queryFn: GetPack
    });

    if (status === 'loading') {
        return <LoadingSpinner />;
    } else if (status === 'error') {
        return (
            <div className='container'>
                <h1>{pack.message}</h1>
            </div>
        )
    }
    
    return (
        <div className='container'>
            <Helmet>
                <title>{'GDDL - ' + pack.Name}</title>
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content='GD Demon Ladder' />
                <meta property='og:title' content={pack.Name} />
                <meta property='og:url' content={`https://gdladder.com/pack/${packID}`} />
                <meta property='og:description' content='The project to improve demon difficulties' />
            </Helmet>
            <h1>{pack.Name}</h1>
            <div id='level-list' className='my-3'>
                <Level info={{ Name: 'Level Name', Song: 'Song', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} isListView={true} key={-1} classes='head' />
                {pack.Levels.map(l => (
                    <Level info={l} isListView={true} key={l.ID} />
                ))}
            </div>
        </div>
    );
}