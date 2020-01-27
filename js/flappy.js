function novoElemento(tagName, className) {
    const elem =  document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const b = new Barreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function parDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`

    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

// const b = new parDeBarreiras(700, 200, 500)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)


function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new parDeBarreiras(altura, abertura, largura),
        new parDeBarreiras(altura, abertura, largura + espaco),
        new parDeBarreiras(altura, abertura, largura + espaco * 2),
        new parDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3

    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando sair da tela
            if(par.getX() < -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const crusouMeio = par.getX() + deslocamento >= meio && par.getX() < meio

            if(crusouMeio) notificarPonto()
        });
    }
}

function Passaro(alturaJogo) {
    let voando =  false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'
    
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`
    this.voar = () => {
        this.elemento.style.transform = `rotate(-60deg)`;
        this.elemento.style.transition = `transform .4s`
    }
    this.cair = () => {
        this.elemento.style.transform = `rotate(90deg)`;
        this.elemento.style.transition = `transform 1.5s`
    }

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () =>{
        const novoY = this.getY() + (voando ? 15 : -4)
        const alturaMaxima = alturaJogo - this.elemento.clientWidth

        if(novoY <= 0 ){
            this.setY = 0
        }else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else{
           this.setY(novoY)
        }
        if(!voando){
            this.cair()
        }else{
            this.voar()
        }
    }

    this.setY(alturaJogo/2)
}

// const barreira = new Barreiras(700,1200,250,400)
// const passaro =  new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')

// areaDoJogo.appendChild(passaro.elemento)
// barreira.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

// setInterval(() =>{
//     barreira.animar()
//     passaro.animar()
// }, 20)
