//array do carrinho
let cart  =[];

//variável da quantiades de pizzas;
let modalQT = 1;

//variável que armazenará o identificador da pizza
let modalKey = 0;

//na const abaixo criei um simplificador de querySelector, onde na função ele recebe um elemento e anexa ao parametro do query e retornando document.querySelector(elemento recebido) para a const c;
const c = (el)=>document.querySelector(el);
//outra const porém agora em querySelectorAll
const cs = (el)=>document.querySelectorAll(el);


//Listagem da pizzas


//função map para acessar cada itém do pizzaJson, arrow function para aplicar modelo simplificado de funções;
//o 1º parametro é para a pizza o 2º para o endereçamento pela posição no array;
//.cloneNode para clonar o elemento, e no parametro se setar true os elementos filhos também serão clonados;
pizzaJson.map((item, index)=>{
    let pizzaItem =  c('.models .pizza-item').cloneNode(true);

    //aqui irá adicionar um atributo nomeado de 'data-key' que irá armazenar o endereçamento da pizza para manipular dentro do modal;
    //1º atributo é qual quero manipular e o 2º qual valor que ro setar pra esse atributo
    pizzaItem.setAttribute('data-key',index);

    //preencher as informações em pizzaItem
    //imagem
    pizzaItem.querySelector('.pizza-item--img img').src=item.img;
    //selecionar o elemento onde ficará a pizza e anexar o nome dela através do name setado em pizzaJson(item.name);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    //preço
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    //descrição
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //evento de click na tag <a>, e setando (e) acessará as propriedades do evento, nesse caso aqui será bloqueado o evento orginal dele com o  preventDefault,  e assim não atualizara a tela.
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();

        //com o data-key setado podemos, usa-lo para preencher as informações do modal com as da pizza clicada
        //closest é um função para procurar o elemento mais próximo que tenha o mesmo nome setado no parametro
        //getAttribute captura a informação de atributos;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //reset da quantidade me pizzas por modal
        modalQT = 1;

        modalKey = key;

        //aplicando as informações ao modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML =  `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //remoção do selected das opções de pizza, afim de resetar a seleção do modal e automatizar com if no forEach abaixo;
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //repare que aqui usamos o cs ao invés de c, pq agora estamos capturando informações em grupo;
        //para percorrer o array de sizes[] das pizzas foi usado o forEach e capturando os valores que cada posição
        //1º parametro será o elemento capturado pelo cs no loop e o sizeIndex o posicionamento dele lá dentro;
        cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            let sizeWeight = pizzaJson[key].sizes[sizeIndex];
            //então toda vez que cliclamos numa pizza a grade estrá seleciona pq o selected estará no index 2 do forEach;
            if(sizeIndex == 2 ){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = sizeWeight;
        }); 
  

        //metodo que aplica as valores desejados ao HTML;
        c('.pizzaInfo--qt').innerHTML = modalQT;


        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200)  
    })
    //comando append para adicionar algo ao elemento, porém agrupando aos existentes e não substituindo;
    c('.pizza-area').append(pizzaItem);
});

//Eventos do modal


//fechar a tela de modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500)
}

//aqui irá selecionar os elementos do HTML , percorrer com forEach e aplicando o evento de closeModal ao item clicado que foi passado como parametro do forEach
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
})
/** Por que não foi usado o o onclick no HTML para invocar o closeModal, o intuito é aplicar um dos conceito de boa prática e código mais clean, para que não fique se misturando(famoso código espaguete) os tipos de código assim facilitando a manutenção.
" o HTML precisa representar a estrutura da página e não o comportamento dela" - Lucas Akira Ayabe,2022.
**/

//botões de quantidade 

c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    //somente irá aplicar a função seo modalQT estiver com valor maior que 1;
    if(modalQT > 1){
        //função de descréscimo 
        modalQT--;
        c('.pizzaInfo--qt').innerHTML = modalQT;
    };
});
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    //função de acréscimo 
    modalQT++;
    c('.pizzaInfo--qt').innerHTML = modalQT;
});


//seleção de tamanhos;

cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
        size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');  
        size.classList.add('selected');   
    })
});


//carrinho de compras
c('.pizzaInfo--addButton').addEventListener('click',()=>{
       
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    //variável para gerar um identificador, algo como um código de informações cruzadas que gera uma identidade;
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //verificador de identifier
    //qual dos identifier do carrinho tem o mesmo identifier do meu
    let key = cart.findIndex((item)=> item.identifier == identifier);

    //caso retorne -1 não encontrou;
    if(key > -1){
        //caso encontre, permitirá a edição de itens e no identifier ele irá somar o valor a mais de pizza;
        cart[key].qt+=modalQT;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id, //qual a pizza?
            size, //qual o tamanho?
            qt:modalQT //quantas pizzas?
        })
    }
    updateCart();
    closeModal();
});


c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
})

c('.menu-closer').addEventListener('click',()=>{
    c('aside').style.left = '100vw';
})


//carrinho de compras
//função de atualizar o carrinho
function updateCart(){

    //atualizar a quantidade de itens no carrinho no mobile
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        //adição da classe que fará aparecer o carrinho
        c('aside').classList.add('show');
        //zerador de carrinho
        c('.cart').innerHTML='';

        let subtotal = 0;
        let desconto = 0; 
        let total = 0; 


        //montagem das informações pro carrinho
        for(let i in cart){
            //identificar a pizza
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;


            //metodo de clonar, agora para replica o modelo porém com as informações para o carrinho
            let cartItem = c('.models .cart--item').cloneNode(true);

            //tamanho da pizza 
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            //templateString 
            let pizzaName =  `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            
            //quantidade de pizzas
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                //somente irá diminuir a quantidade se tiver mais que 1 item
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    //remover o item do carrinho se zerar o contador de quantidade
                    cart.splice(i,1);
                }
                //recursividade, a função se auto invoca
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });
            
            //
            c('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        //função last-child para procurar dentro de cada classe o ultimo elemento do tipo setado ali, nesse caso o span;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        //escode o asid do carrinho de compras
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

/*
construção do código de envio do pedido via whatsapp


c('.cart--finalizar').addEventListener('click',()=>{
        let mensagem;
    
        mensagem = `Olá! eu gostaria:
        

        ` ;
    
        window.open("https://wa.me/+5547992812098?text= " + mensagem);

})


*NÃO CONCLUÍDO*
*/