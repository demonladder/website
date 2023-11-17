import { PackShell } from '../types/PackShell';
import CategoryResponse from './Category';

export type PackInfo = {
    packs: PackShell[];
    categories: CategoryResponse[];
};