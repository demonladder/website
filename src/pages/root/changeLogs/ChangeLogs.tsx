import Markdown from 'react-markdown';
import { useQuery } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import markdownComponents from '../../../utils/markdownComponents';
import Page from '../../../components/Page';

export default function ChangeLogs() {
    const { data: markdown } = useQuery({
        queryKey: ['changelogs'],
        queryFn: () => APIClient.get<string>('/changelogs').then((res) => res.data),
    });

    return (
        <Page>
            <Markdown children={markdown} components={markdownComponents} />
        </Page>
    );
}
