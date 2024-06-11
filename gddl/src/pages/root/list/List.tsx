import { Link, useParams } from 'react-router-dom';
import Container from '../../../components/Container';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ListLevel from './ListLevel';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import User from '../../../api/v2/user';

interface Meta {
    ID: number;
    Name: string;
    Creator: string;
    Description: string | null;
    SongID: number;
    Length: number;
    IsTwoPlayer: 0 | 1;
    Difficulty: string;
}

interface Level {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Deviation: number | null;
    RatingCount: number;
    EnjoymentCount: number;
    SubmissionCount: number;
    TwoPlayerRating: number | null;
    TwoPlayerDeviation: number | null;
    DefaultRating: number | null;
    Showcase: string | null;
    Meta: Meta;
}

export interface IListLevel {
    ListID: number;
    LevelID: number;
    Position: number;
    AddedAt: string;
    UpdatedAt: string;
    Level: Omit<Level, "RatingCount" | "EnjoymentCount" | "SubmissionCount">;
}

export interface List {
    ID: number;
    Name: string;
    Description: string | null;
    Type: number;
    AverageTier: number | null;
    MedianTier: number | null;
    OwnerID: number;
    CreatedAt: string;
    UpdatedAt: string;
    Levels: IListLevel[];
    Owner: User;
}

function GetList(listID: number): Promise<List> {
    return APIClient.get(`/v2/list/${listID}`).then((res) => res.data);
}

export default function List() {
    const { listID } = useParams();
    const validListID = !(listID === undefined || !parseInt(listID));
    const [isDragLocked, setIsDragLocked] = useState(false);

    const queryClient = useQueryClient();

    const { data: list } = useQuery({
        queryKey: ['list', listID],
        queryFn: () => GetList(parseInt(listID as unknown as string)),
        enabled: validListID,
    });

    const setPosition = useCallback((oldPosition: number, newPosition: number) => {
        if (oldPosition === newPosition) return;
    
        const oldID = list?.Levels.find((l) => l.Position === oldPosition)?.LevelID;
        if (!oldID) return;
    
        setIsDragLocked(true);
    
        toast.promise(
            APIClient.put(`/v2/list/${listID}/moveLevel`, { levelID: oldID, newPosition }).then(() => queryClient.invalidateQueries(['list', listID])).finally(() => setIsDragLocked(false)),
            {
                success: 'Moved level',
                pending: 'Moving...',
                error: {
                    render: ({ data }) => {
                        return (data as any)?.error ?? 'An error occurred';
                    },
                },
            },
        );
    }, [list, listID]);

    if (!validListID) {
        return (
            <Container>
                <h1 className='text-4xl'>404: List not found</h1>
            </Container>
        );
    }

    return (
        <Container>
            {list === undefined
                ? <h1 className='text-4xl'><LoadingSpinner /></h1>
                : <>
                    <h1 className='text-4xl'>{list.Name} <span className='text-base'>by <Link to={`/profile/${list.OwnerID}`} className='text-blue-400'>{list.Owner.Name}</Link></span></h1>
                    <h2 className='text-xl'>{list.Description}</h2>
                    <ol className='mt-4'>
                        {list.Levels.map((level) => <ListLevel list={list} listLevel={level} setPosition={setPosition} dragLocked={isDragLocked} key={level.LevelID} />)}
                    </ol>
                    {list.Levels.length === 0 && (
                        <p><i>This list doesn't have any levels yet</i></p>
                    )}
                </>
            }
        </Container>
    );
}