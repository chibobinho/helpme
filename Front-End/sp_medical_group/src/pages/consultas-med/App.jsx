import { React, Component } from 'react';
import axios from "axios";
import { parseJwt, usuarioAutenticado } from '../../services/auth/auth';

import logo_spmed from "../../assets/Imagem_logo.png"
import circulo from "../../assets/circulo.png"


export default class Consultas extends Component {

    constructor(props) {
        super(props)
        this.state = {
            listaConsultas: [],
            consulta: [],
            nome: '?',
            descricao: '',

        }
    }

    redirecionarPara = (path) => {
        this.props.history.push(path.target.name)
    }

    efetuarLogout = () => {
        localStorage.removeItem('usuario-login')
        this.props.history.push('/login')
    }

    async listarConsultasMedico() {
        await axios('http://localhost:5000/api/Consultas/med/' + parseJwt().email, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            },
        })
            .then(resposta => {
                if (resposta.status == 200) {
                    this.setState({ listaConsultas: resposta.data })
                };
            })

            .catch(erro => console.log(erro))
    }

    obterConsulta = (event) => {
        axios(`http://localhost:5000/api/Consultas/${event.target.value}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            },
        })
            .then(resposta => {
                console.log('consulta')
                if (resposta.status == 200) {
                    this.setState({
                        consulta: resposta.data,
                        nome: resposta.data.idPacienteNavigation.nomePac,
                        descricao: resposta.data.descricao
                    })
                };
            })

            .catch(erro => console.log(erro))
    }

    atualizaStateCampo = (campo) => {
        this.setState({ [campo.target.name]: campo.target.value });
        console.log(this.state)
    };

    editarDescricao = (event) => {
        event.preventDefault()

        let consulta = this.state.consulta
        consulta.descricao = this.state.descricao

        console.log(consulta)

        axios
            .put('http://localhost:5000/api/Consultas', consulta, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
                },
            })
            .then((resposta) => {
                if (resposta.status === 201) {
                    console.log('Consulta cadastrada!');
                }
            })
            .catch((erro) => {
                console.log(erro);
            })
    }

    componentDidMount() {
        this.listarConsultasMedico();
    }

    render() {
        return (
            <div>
                <header className="container">
                    <img src={logo_spmed} alt="Logo SPMedicalGroup" />
                    <nav>
                        <a name="/" onClick={this.redirecionarPara}>Home</a>
                        {
                            usuarioAutenticado() ?
                                parseJwt().role === 'ADM' ?
                                    <a name="/consultas" onClick={this.redirecionarPara} >Consultas</a> :

                                    parseJwt().role === 'MED' ?
                                        <a name="/consultas-medico" onClick={this.redirecionarPara} >Consultas</a> :

                                        parseJwt().role === 'PAC' ?
                                            <a name="/consultas-paciente" onClick={this.redirecionarPara} >Consultas</a> :

                                            null : null

                        }

                        {
                            usuarioAutenticado()
                                ? <button id="deslogar" name="/login" onClick={this.efetuarLogout} >Desconectar</button>
                                : <button id="logar" name="/login" onClick={this.redirecionarPara} >Conectar</button>

                        }
                    </nav>
                </header>

                <main className="main-consultas container">
                    <h1>Consultas</h1>
                    <hr />
                    <div className="consultas-section">
                        <section className="listar">
                            {
                                this.state.listaConsultas.map(x => {
                                    return (
                                        <article>
                                            <div className="nomes-consulta">
                                                <img src={circulo} alt="" />
                                                <div className="nomes-div">
                                                    <p>Dr. {x.idMedicoNavigation.nomeMed}</p>
                                                    <span>{x.idPacienteNavigation.nomePac}</span>
                                                </div>
                                            </div>

                                            <button value={x.idConsulta} onClick={this.obterConsulta}>Inserir descri????o</button>


                                            <div className="hora-consulta">
                                                <p>{Intl.DateTimeFormat("pt-BR", {
                                                    hour: 'numeric', minute: 'numeric'
                                                }).format(new Date(x.dataConsulta))}</p>

                                                <span>{Intl.DateTimeFormat("pt-BR", {
                                                    year: 'numeric', month: 'numeric', day: 'numeric',
                                                }).format(new Date(x.dataConsulta))}</span>
                                            </div>
                                        </article>
                                    )
                                })
                            }

                        </section>

                        <section className="cadastrar">
                            <h2>Inserir descri????o</h2>
                            <hr />
                            
                            <article>
                                {this.state.nome}
                            </article>

                            <hr />
                            <form onSubmit={this.editarDescricao}>
                                <textarea name="descricao" id="" cols="30" rows="10" value={this.state.descricao} onChange={this.atualizaStateCampo}></textarea>

                                <button className="submit-cadastrar" type="submit">Inserir</button>
                            </form>
                        </section>
                    </div>
                </main>
            </div>
        )
    }
}