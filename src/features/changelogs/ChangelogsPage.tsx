import Markdown from 'react-markdown';
import markdownComponents from '../../utils/markdownComponents';
import Page from '../../components/Page';
import { useChangelogs } from './hooks/useChangelogs';

export default function Changelogs() {
    const { data: markdown } = useChangelogs();

    return (
        <Page>
            <Markdown children={markdown} components={markdownComponents} />
        </Page>
    );
}
