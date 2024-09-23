import Markdown from 'react-markdown';
import Container from '../../../components/Container';
import NewLabel from '../../../components/NewLabel';
import { useQuery } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import markdownComponents from '../../../utils/markdownComponents';

export default function ChangeLogs() {
    const { data: markdown } = useQuery({
        queryKey: ['changelogs'],
        queryFn: () => APIClient.get<string>('/changelogs').then((res) => res.data),
    });

    return (
        <Container>
            <p><NewLabel ID='changelogs' /></p>
            <Markdown children={markdown} components={markdownComponents} />
        </Container>
    );
}