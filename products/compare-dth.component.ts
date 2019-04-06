import { Component, OnInit ,Renderer2,Inject} from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";

@Component({
  selector: 'app-compare-dth',
  templateUrl: './compare-dth.component.html',
  styles: []
})
export class CompareDthComponent implements OnInit {

  constructor(
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
  ) { 
    this.init_script();
  }

  ngOnInit() {
  }

  init_script()
  {
    if($('#init-page-script'))
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.id = `init-page-script`;
    script.type = `text/javascript`;
    script.text = `
      $('.modal').modal();
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
}
