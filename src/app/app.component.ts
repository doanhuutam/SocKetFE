import { Component } from '@angular/core';
import {Stomp} from "@stomp/stompjs";
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fedemo';
  description = 'Angular-WebSocket Demo';
  message: string = "";
  greetings: string[] = [];
  disabled = true;
  name: string ="";
  private stompClient: any;

  constructor() {
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = ["hãy bắt đầu trò truyện:"];
    }
  }

  connect() {
    // đường dẫn đến server

    const socket = new SockJS('http://localhost:8080/gkz-stomp-endpoint/',["protocolOne", "protocolTwo"]);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      // là chờ xèm thằng server gửi về.
      _this.stompClient.subscribe('/topic/public', function (hello: any) {
        _this.showGreeting(JSON.parse(hello.body).greeting);
      });

    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName() {
    this.stompClient.send(
      '/gkz/hello',
      {},
      // Dữ liệu được gửi đi
      JSON.stringify({'name': this.name, 'message': this.message})
    );
  }

  showGreeting(message: any) {
    this.greetings.push(message);
  }
}
