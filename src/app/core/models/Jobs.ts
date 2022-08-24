export interface JobItem {
    _id?: string;
    _jobDepartment: string | { _id: string, name: string },
    name: string;
}