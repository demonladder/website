import User from '../User';
import IList from '../List';
import { IListLevel } from '../../../pages/root/list/List';

type List = IList & {
    Levels: IListLevel[];
    Owner: User;
};

export default List;