import { Component, OnInit } from '@angular/core';
declare var pramukhIME;

@Component({
	selector: 'app-guj-poc',
	templateUrl: './guj-poc.component.html',
	styleUrls: ['./guj-poc.component.scss']
})
export class GujPocComponent implements OnInit {

	testGuj: string;
	testEng: string;
	testKeyBoard: string;

	constructor() { }

	ngOnInit() {
	}

	converToGuj() {
		pramukhIME.addKeyboard(PramukhIndic, 'gujarati');
		this.testGuj = pramukhIME.convert(this.testEng);
	}

	converToSelf() {
		pramukhIME.resetSettings();
		let test = pramukhIME.convert(this.testGuj);
		console.log(test);
		pramukhIME.addKeyboard(PramukhIndic, 'gujarati');
		this.testGuj = pramukhIME.convert(test);;
		console.log(this.testGuj)
	}

	//  copyright lexilogos.com

	transcrire() {
		let car = this.testKeyBoard;

		car = car.replace(/a/g, "àª…");
		car = car.replace(/[AÄ]/g, "àª†");
		car = car.replace(/i/g, "àª‡");
		car = car.replace(/[IÄ«]/g, "àªˆ");
		car = car.replace(/u/g, "àª‰");
		car = car.replace(/[UÅ«]/g, "àªŠ");
		car = car.replace(/àª…àª…/g, "àª†");
		car = car.replace(/àª‡àª‡/g, "àªˆ");
		car = car.replace(/àª‰àª‰/g, "àªŠ");
		car = car.replace(/e/g, "àª");
		car = car.replace(/[EÄ“]/g, "àª");
		car = car.replace(/àªàª/g, "àª");
		car = car.replace(/o/g, "àª“");
		car = car.replace(/[OÅ]/g, "àª‘");
		car = car.replace(/àª“àª“/g, "àª‘");
		car = car.replace(/àª…àª‡/g, "àª");
		car = car.replace(/àª…àª‰/g, "àª”");


		// suppression du virama 
		car = car.replace(/à«àª…/g, "\u200b");
		car = car.replace(/\u200bàª…/g, "àª¾");
		car = car.replace(/\u200bàª‡/g, "à«ˆ");
		car = car.replace(/\u200bàª‰/g, "à«Œ");
		car = car.replace(/à«àª†/g, "àª¾");
		car = car.replace(/à«àª‡/g, "àª¿");
		car = car.replace(/à«àªˆ/g, "à«€");
		car = car.replace(/à«àª‰/g, "à«");
		car = car.replace(/à«àªŠ/g, "à«‚");
		car = car.replace(/à«àª/g, "à«…");
		car = car.replace(/à«àª‘/g, "à«‰");
		car = car.replace(/à«àª‹/g, "à«ƒ");
		car = car.replace(/à«à« /g, "à«„");
		car = car.replace(/à«àªŒ/g, "à«¢");
		car = car.replace(/à«à«¡/g, "à«£ ");
		car = car.replace(/à«àª/g, "à«‡");
		car = car.replace(/à«àª“/g, "à«‹");
		car = car.replace(/à«‡àª/g, "à«…");
		car = car.replace(/à«‹àª“/g, "à«‰");
		car = car.replace(/àª¿àªˆ/g, "à«€");
		car = car.replace(/à«àª‰/g, "à«‚");
		car = car.replace(/àª¿àª‡/g, "à«€");
		car = car.replace(/à« /g, " ");

		//cons
		car = car.replace(/k/g, "àª•à«");
		car = car.replace(/g/g, "àª—à«");
		car = car.replace(/c/g, "àªšà«");
		car = car.replace(/j/g, "àªœà«");
		car = car.replace(/z/g, "àªà«");
		car = car.replace(/[Tá¹¬á¹­]/g, "àªŸà«");
		car = car.replace(/[Dá¸Œá¸]/g, "àª¡à«");
		car = car.replace(/[Ná¹†á¹‡]/g, "àª£à«");
		car = car.replace(/t/g, "àª¤à«");
		car = car.replace(/d/g, "àª¦à«");
		car = car.replace(/n/g, "àª¨à«");
		car = car.replace(/p/g, "àªªà«");
		car = car.replace(/f/g, "àª«à«");
		car = car.replace(/b/g, "àª¬à«");
		car = car.replace(/m/g, "àª®à«");
		car = car.replace(/y/g, "àª¯à«");
		car = car.replace(/r/g, "àª°à«");
		car = car.replace(/l/g, "àª²à«");
		car = car.replace(/[Lá¸¶á¸·]/g, "àª³à«");
		car = car.replace(/v/g, "àªµà«");
		car = car.replace(/w/g, "àªµà«");
		car = car.replace(/s/g, "àª¸à«");
		car = car.replace(/h/g, "àª¹à«");
		car = car.replace(/[Sá¹¢á¹£]/g, "àª·à«");

		// cas particuliers
		car = car.replace(/[Gá¹…]/g, "àª™à«");
		car = car.replace(/[JÃ±]/g, "àªžà«");
		car = car.replace(/àª¨à«àª—à«/g, "àª™à«");
		car = car.replace(/àª¨à«àªœà«/g, "àªžà«");

		// aspirÃ©es
		car = car.replace(/àª•à«àª¹à«/g, "àª–à«");
		car = car.replace(/àª—à«àª¹à«/g, "àª˜à«");
		car = car.replace(/àªšà«àª¹à«/g, "àª›à«");
		car = car.replace(/àªœà«àª¹à«/g, "àªà«");
		car = car.replace(/àªŸà«àª¹à«/g, "àª à«");
		car = car.replace(/àª¡à«àª¹à«/g, "àª¢à«");
		car = car.replace(/àª¤à«àª¹à«/g, "àª¥à«");
		car = car.replace(/àª¦à«àª¹à«/g, "àª§à«");
		car = car.replace(/àªªà«àª¹à«/g, "àª«à«");
		car = car.replace(/àª¬à«àª¹à«/g, "àª­à«");

		// cas du s barre
		car = car.replace(/àª¸à«àª¹à«/g, "àª¶à«");
		car = car.replace(/[Ã§Å›]/g, "àª¶à«");

		// cas du ri li 
		car = car.replace(/à«-àª°à«/g, "à«ƒ");
		car = car.replace(/-àª°à«/g, "àª‹");
		car = car.replace(/àª‹àª‡/g, "à« ");
		car = car.replace(/à«ƒàª‡/g, "à«„");

		car = car.replace(/à«-àª²à«/g, "à«¢");
		car = car.replace(/-àª²à«/g, "àªŒ");
		car = car.replace(/àªŒàª‡/g, "à«¡");
		car = car.replace(/à«¢àª‡/g, "à«£");

		//suppression du zero
		car = car.replace(/\u200bàª•/g, "àª•");
		car = car.replace(/\u200bàª–/g, "àª–");
		car = car.replace(/\u200bàª—/g, "àª—");
		car = car.replace(/\u200bàª˜/g, "àª˜");
		car = car.replace(/\u200bàª™/g, "àª™");
		car = car.replace(/\u200bàªš/g, "àªš");
		car = car.replace(/\u200bàª›/g, "àª›");
		car = car.replace(/\u200bàªœ/g, "àªœ");
		car = car.replace(/\u200bàª/g, "àª");
		car = car.replace(/\u200bàªž/g, "àªž");
		car = car.replace(/\u200bàªŸ/g, "àªŸ");
		car = car.replace(/\u200bàª /g, "àª ");
		car = car.replace(/\u200bàª¡/g, "àª¡");
		car = car.replace(/\u200bàª¢/g, "àª¢");
		car = car.replace(/\u200bàª£/g, "àª£");
		car = car.replace(/\u200bàª¤/g, "àª¤");
		car = car.replace(/\u200bàª¥/g, "àª¥");
		car = car.replace(/\u200bàª¦/g, "àª¦");
		car = car.replace(/\u200bàª§/g, "àª§");
		car = car.replace(/\u200bàª¨/g, "àª¨");
		car = car.replace(/\u200bàªª/g, "àªª");
		car = car.replace(/\u200bàª«/g, "àª«");
		car = car.replace(/\u200bàª¬/g, "àª¬");
		car = car.replace(/\u200bàª­/g, "àª­");
		car = car.replace(/\u200bàª®/g, "àª®");
		car = car.replace(/\u200bàª¯/g, "àª¯");
		car = car.replace(/\u200bàª°/g, "àª°");
		car = car.replace(/\u200bàª²/g, "àª²");
		car = car.replace(/\u200bàª³/g, "àª³");
		car = car.replace(/\u200bàª¹/g, "àª¹");
		car = car.replace(/\u200bàª¶/g, "àª¶");
		car = car.replace(/\u200bàª·/g, "àª·");
		car = car.replace(/\u200bàª¸/g, "àª¸");
		car = car.replace(/\u200b /g, " ");
		car = car.replace(/\u200b\àª‚/g, "àª‚");
		car = car.replace(/\u200b\àªƒ/g, "àªƒ");

		// virama permanent
		car = car.replace(/=/g, "\u200c");
		// car = car.replace(/à«à«\u200c/g, "à«\u200c");

		// anusvara
		car = car.replace(/[Má¹]/g, "àª‚");
		car = car.replace(/à«àª‚/g, "àª‚");
		// candrabindu 
		car = car.replace(/àª‚àª‚/g, "àª");

		// visarga
		car = car.replace(/[Há¸¤á¸¥]/g, "àªƒ");
		car = car.replace(/à«àªƒ/g, "àªƒ");

		// avagraha
		car = car.replace(/\'/g, "àª½");
		car = car.replace(/â€™/g, "àª½");

		//OM
		car = car.replace(/W/g, "à«");

		// ponctuation
		car = car.replace(/\|/g, "à¥¤");
		car = car.replace(/\//g, "à¥¤");
		car = car.replace(/à¥¤à¥¤/g, "à¥¥");

		car = car.replace(/0/g, "à«¦");
		car = car.replace(/1/g, "à«§");
		car = car.replace(/2/g, "à«¨");
		car = car.replace(/3/g, "à«©");
		car = car.replace(/4/g, "à«ª");
		car = car.replace(/5/g, "à««");
		car = car.replace(/6/g, "à«¬");
		car = car.replace(/7/g, "à«­");
		car = car.replace(/8/g, "à«®");
		car = car.replace(/9/g, "à«¯");
		console.log(car);
		this.testKeyBoard = car;
	}

}
