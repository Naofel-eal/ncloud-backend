export default class PushFileDto {
    readonly userID : number;
    readonly name : string;
    readonly cryptedName : string;
    readonly type : string;
    readonly size : number;
    readonly parentFolderID : number;
}