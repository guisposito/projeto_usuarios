class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();

    }

    //para toda vez que clicar no submit
    onSubmit(){

        //coleta dados do formulario
        this.formEl.addEventListener("submit", event => {//arrow function

            //para tudo oq ele disparou, cancelar o padrão de envio ou refresh da página;
            event.preventDefault();

            //evitando de cadastrar varias vezes o mesmo user
            let btn = this.formEl.querySelector("[type=submit]");
            //trancando o botão salvar
            btn.disabled = true;

            //adicionando a imagem
            let values = this.getValues()
            //values.photo = "";

            //validando se a foto está vazia
            if(!values) return false;

            this.getPhoto().then(
                (content) => {

                    values.photo = content;

                    this.addLine(values);
                    //apagando o formulario para ser preenchido novamente
                    this.formEl.reset();
                    //ativando o botão salvar
                    btn.disabled = false;
            },
                (e) =>{
                    console.error(e);
            });

        });
    }

    //função para adicionar imagem
    getPhoto(){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            ///se o item retirado do filtro for === a foto ele retorna o mesmo item
            let elements = [...this.formEl.elements].filter(item=>{
                
                if (item.name === 'photo'){
                    return item;
                }
            });

            //localiza a imagem no array
            let file = elements[0].files[0];

            fileReader.onload = () => {
                //quando der certo usar o resolve
                resolve(fileReader.result);

            };

            fileReader.onerror = (e) =>{
                //quando der erro
                reject(e);
            }
            // verifica se realmente tem arquivo
            if (file) {
                fileReader.readAsDataURL(file);
            } else{
                resolve('dist/img/boxed-bg.jpg');
            }

        });

        
    }

    getValues(){

        let user = {};
        let IsValid = true;

        
        //spread, transformou em array e utilizou o spread para nao ter q colocar o indice e funcionar o foreach
        [...this.formEl.elements].forEach(function(field, index){

            
            //validando campos não preenchidos
            if(['name','email','password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add('has-error');
                IsValid = false;
                
            }



            if(field.name == "gender"){
    
                if(field.checked){
                    user[field.name] = field.value;
                }
            
                ////para o admin nao ir checado
            } else if(field.name == "admin"){

                user[field.name] = field.checked;

            } else{
                user[field.name] = field.value;
            }
    
        });
    
        //armazena o objeto na nova classe
        //um objeto é uma variavel que estancia uma classe

        //validando se o formulário está vazio
        if (!IsValid) {
            return false;
        }

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    //add uma linha na tabela
    addLine(dataUser){

        let tr = document.createElement('tr');

        //utilizando o dataset e o json para converter o dataset em string, se não ele salva em objeto
        tr.dataset.user = JSON.stringify(dataUser);

        //adicionando o templateString
        //o ${}indica uma variavel dentro do templatestring
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.tableEl.appendChild(tr);

        this.updateCount();

    }

    //calcula o total das estatisticas
    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;

            //json.parse converte para objeto para que podemos ver os elementos passados
            
            let user = JSON.parse(tr.dataset.user);
            //ja incrementa se for admin;
            if (user._admin) numberAdmin++;

        });

        

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }

}
