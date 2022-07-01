import { Component } from '@angular/core';
import { NoteEventTime } from '@spotify/basic-pitch/types';
import { generateFileData} from '@spotify/basic-pitch';
import { saveAs } from 'file-saver';
import { FileToNotesService } from './services/file-to-notes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private file: File | undefined;
  private notes: NoteEventTime[] | undefined;
  duration:number|undefined;

  constructor(private fileToNotes: FileToNotesService) {
  }

  async fileChanged(e: any) {
    this.duration = undefined;
    console.log("File uploaded");
    this.file = e.target.files[0];
    this.fileIsOk();
  }

  async transcript() {
    if (await this.fileIsOk()) {
      this.notes = await this.fileToNotes.getNotesFromFile(this.file!);
      console.log(this.notes);
    }
  }

  private async fileIsOk(): Promise<boolean> {
    if (this.file === null && this.file === undefined) {
      return false;
    }

    var audio = document.createElement('audio');
    var reader = new FileReader();

    reader.readAsDataURL(this.file!);
    while (reader.result === null) {
      await new Promise(r => setTimeout(r, 1));
    }
    audio.src = reader.result as string;
    audio.addEventListener('loadedmetadata', () => {
      this.duration = audio.duration;
    }, false);

    return true;
  }

  notesToMidi(){
    if (this.notes){
      saveAs(new File([generateFileData(this.notes) as Uint8Array], 'saved.mid'));
    }
  }

  isNotesFilled(){
    return this.notes !== undefined;
  }
  


}
