class UserController {

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formIdUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();

    }

    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();

        });

        this.formIdUpdateEl.addEventListener("submit", event =>{
            //cancelando comportamento da página
            event.preventDefault();
            //evitando de cadastrar varias vezes o mesmo user
            let btn = this.formIdUpdateEl.querySelector("[type=submit]");
            //trancando o botão salvar
            btn.disabled = true;

            let values = this.getValues(this.formIdUpdateEl);

            let index = this.formIdUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `
                <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${values.name}</td>
                <td>${values.email}</td>
                <td>${(values.admin) ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(values.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;

            this.addEventsTr(tr);

            this.updateCount();


        });

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
            let values = this.getValues(this.formEl);
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

    getValues(formEl){

        let user = {};
        let IsValid = true;

        
        //spread, transformou em array e utilizou o spread para nao ter q colocar o indice e funcionar o foreach
        [...formEl.elements].forEach(function(field, index){

            
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
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();

    }

    //evento de click dentro do btn-edit
    addEventsTr(tr){
        //coletando os dados da linha para editar
        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            //convertendo para obj
            let json = JSON.parse(tr.dataset.user);

            //criando um id para cada linha pois precisamos recuperar o formulario e devolver na mesma linha
            this.formIdUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            //for in para trazer todos os campos do formulário
            for (let name in json){
                //selecionand o nome do campo trazido pelo json e dando um replace para retirar o _
                let field = this.formIdUpdateEl.querySelector("[name =" + name.replace("_", "") + "]");

                //verificando o se o campo existe
                if (field) {


                    switch (field.type) {
                        case 'file':
                        continue;

                        case 'radio':
                            //verificando o input que tenha o gender e o value
                            field = this.formEl.querySelector("[name =" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = 'true';
                        break;

                        case 'checkbox' :
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                    }

                    field.value = json[name];

                }

            }

            //recuperando a foto
            this.formIdUpdateEl.querySelector(".photo").src = json._photo;
           
            this.showPanelUpdate();

        });
    }

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display ="block";
        document.querySelector("#box-user-update").style.display ="none";

    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display ="none";
        document.querySelector("#box-user-update").style.display ="block";

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
