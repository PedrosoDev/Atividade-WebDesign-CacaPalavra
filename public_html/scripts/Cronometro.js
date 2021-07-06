
"use strict";

class Cronometro {

    constructor(mili, textId) {
        this.hh = 0;
        this.mm = 0;
        this.ss = 0;

        this.mili = mili;
        this.cron = null;
        this.textID = textId;
    }

    start() {
        this.cron = setInterval(() => { this.timer(); }, this.mili);
        if (document.getElementById(this.textID) != null) {
            document.getElementById(this.textID).innerHTML = "00:00:00";
        }
    }

    //Para o temporizador mas não limpa as variáveis
    pause() {
        if (this.cron === null) return;
        clearInterval(this.cron);
    }

    //Para o temporizador e limpa as variáveis
    stop() {
        if (this.cron === null) return;
        clearInterval(this.cron);
        this.hh = 0;
        this.mm = 0;
        this.ss = 0;

        if (document.getElementById(this.textID) != null) {
            document.getElementById(this.textID).innerHTML = "00:00:00";
        }
    }

    //Faz a contagem do tempo e exibição
    timer() {
        this.ss++; //Incrementa +1 na variável ss

        if (this.ss == 59) { //Verifica se deu 59 segundos
            this.ss = 0; //Volta os segundos para 0
            this.mm++; //Adiciona +1 na variável mm

            if (this.mm == 59) { //Verifica se deu 59 minutos
                this.mm = 0;//Volta os minutos para 0
                this.hh++;//Adiciona +1 na variável hora
            }
        }

        //Cria uma variável com o valor tratado HH:MM:SS
        var format = (this.hh < 10 ? '0' + this.hh : this.hh) + ':' + (this.mm < 10 ? '0' + this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss);

        //Insere o valor tratado no elemento counter
        if (document.getElementById(this.textID) != null) {
            document.getElementById(this.textID).innerHTML = format;
        }

        //Retorna o valor tratado
        return format;
    }

}