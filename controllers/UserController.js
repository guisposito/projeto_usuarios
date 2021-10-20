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

            //adicionando a imagem
            let values = this.getValues()
            values.photo = "";

            //chamando a função no submit
            this.getPhoto((content)=>{
                
                values.photo = content;

                this.addLine(values);
            });


            this.addLine(values);

        });
    }

    //função para adicionar imagem
    getPhoto(callback){

        let fileReader = new FileReader();

        ///se o item retirado do filtro for === a foto ele retorna o mesmo item
        let elements = [...this.formEl.elements].filter(item=>{
            
            if (item.name === "photo"){
                return item;
            }
        });

        //localiza a imagem no array
        let file = elements[0].files[0];

        fileReader.onload = () =>{
            
            callback(fileReader.result);

        };

        fileReader.readAsDataURL(file);

    }

    getValues(){

        let user = {};

        
        //spread, transformou em array e utilizou o spread para nao ter q colocar o indice e funcionar o foreach
        [...this.formEl.elements].forEach(function(field, index){

            if(field.name == "gender"){
    
                if(field.checked){
                    user[field.name] = field.value;
                }
    
            }else{
                user[field.name] = field.value;
            }
    
        });
    
        //armazena o objeto na nova classe
        //um objeto é uma variavel que estancia uma classe
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

        //adicionando o templateString
        //o ${}indica uma variavel dentro do templatestring
        this.tableEl.innerHTML = `
            <tr>
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${dataUser.birth}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;

    }

}
