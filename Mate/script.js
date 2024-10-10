import { MyWysiwyg } from './my_wysiwyg.js';
 
const textarea = document.getElementById('texte');
 
const mw = new MyWysiwyg(textarea, {
    buttons: ['bold', 'italic', 'strikethrough']
});