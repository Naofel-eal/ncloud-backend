export default class PushFolderDto {
    readonly userID : number;
    readonly name : string;
    readonly cryptedName : string;
    readonly filesID : number[];
    readonly foldersID : number[];
    readonly parentFolderID : number;
}