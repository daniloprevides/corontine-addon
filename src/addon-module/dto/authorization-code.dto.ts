export class AuthorizationCodeDTO {
    constructor(
        public name:string,
        public description:string,
        public scopes:Array<any>,
        public code:string,
        public redirect_uri:string
    ){}
}