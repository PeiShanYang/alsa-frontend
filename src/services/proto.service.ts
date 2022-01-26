import { HelloRequest, HelloReply } from '../pb/helloworld_pb';
import { GreeterClient } from '../pb/HelloworldServiceClientPb';

export class ProtoService {
    static client: GreeterClient;

    static connect() {
        ProtoService.client = new GreeterClient('http://localhost:3000');
    }

    static async sayHello(): Promise<string> {
        const request = new HelloRequest();
        request.setName("Joe Huang");
        const res: HelloReply = await ProtoService.client.sayHello(request, {});
        console.log(res);
        return res.getMessage();
    }
}