import { Expose , Exclude } from "class-transformer";

export class Userdto {
    @Expose()
    id: number;
    @Expose()
    email: string;
}