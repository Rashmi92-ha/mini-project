import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-signal-demo',
  standalone: true,
  imports: [],
  templateUrl: './signal-demo.component.html',
  styleUrl: './signal-demo.component.scss'
})
export class SignalDemoComponent {
  firstName = signal("Rashmi");
  lastName = signal("KS")
  count = signal(0);
  increment(){
    this.count.update(
      value => value + 1
    )
  }

  reset(){
    this.count.set(0);
  }

  fullName = computed(
    () => this.firstName() + ' ' + this.lastName()
  );

  changeName(){
    this.firstName.set('Chethan')
  }
}
