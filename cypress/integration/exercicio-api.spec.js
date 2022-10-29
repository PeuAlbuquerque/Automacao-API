/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     
     it('Deve validar contrato de usuários', () => {

          cy.request('usuarios').then((response) => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.body).to.have.property('usuarios')
               expect(response.status).to.equal(200)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Usuario ${Math.floor(Math.random() * 100000)}`
          let email = `${Math.floor(Math.random() * 100000)}@ebac.com.br`

          cy.cadastrarUsuario(usuario, email, "teste", "true").then((response) => {
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               expect(response.status).to.equal(201)
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          let usuario = `Usuario ${Math.floor(Math.random() * 100000)}`

          cy.cadastrarUsuario(usuario, "42992@ebac.com.br", "teste", "true").then((response) => {
               expect(response.body.message).to.equal('Este email já está sendo usado')
               expect(response.status).to.equal(400)
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let usuario = `Usuario ${Math.floor(Math.random() * 100000)}`
          let email = `${Math.floor(Math.random() * 100000)}@ebac.com.br`
          cy.cadastrarUsuario(usuario, email, "teste", "true").then((response) => {
               let id = response.body._id

               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": usuario,
                         "email": email,
                         "password": "teste",
                         "administrador": "true"
                    }
               })
          }).then((response) => {
               expect(response.body.message).to.equal('Registro alterado com sucesso')
               expect(response.status).to.equal(200)
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `Usuario ${Math.floor(Math.random() * 100000)}`
          let email = `${Math.floor(Math.random() * 100000)}@ebac.com.br`

          cy.cadastrarUsuario(usuario, email, "teste", "true").then((response) => {
               let id = response.body._id

               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               })
          }).then((response) => {
               expect(response.body.message).to.equal('Registro excluído com sucesso')
               expect(response.status).to.equal(200)
          })
     });
});
