import React from 'react'
import axios from 'axios'
import { browserHistory, Link } from 'react-router'
import Modal from 'react-modal'

import comdisfoGlobals from '../../utils/comdisfoGlobals'
import {apiPath} from '../../../config.js'
import {i18n_actions} from '../../i18n/i18n'
import models from '../../../models/all_models'

const menuItems = { 
    new: {id: 'edit/0', label: i18n_actions.new, icon:'plus', n:'x', readonly:false},
    del: {id: 'del', label: i18n_actions.delete1, icon:'trash', n:'1', readonly:false},
    save: {id:'save', label: i18n_actions.save, icon:'floppy-disk', n:'1', readonly:false},
    views: {
        browse: {id:'browse', label: i18n_actions.browse, icon:'eye-open', n:'1'},// // ReadOnly
        edit: {id:'edit', label: i18n_actions.edit, icon:'edit', n:'1', readonly:false},// // All Fields for editing
        comment: {id:'comment', label: i18n_actions.comment, icon:'comment', n:'1', readonly:false},// // All Fields for editing
        list: {id:'list', label: i18n_actions.list, icon:'th-list', n:'n'},
        cards: {id:'cards', label: i18n_actions.cards, icon:'th-large', n:'n'},
        charts: {id:'charts', label: i18n_actions.charts, icon:'stats', n:'n'}
    },
}

function isFunction(fn) {
    var getType = {};
    return fn && getType.toString.call(fn) === '[object Function]';
}

export default React.createClass({

    propTypes: {
        params: React.PropTypes.shape({
            entity: React.PropTypes.string.isRequired,
            id: React.PropTypes.string
        }),
    },

    getInitialState() {
        return {
            deleteConfirmation: false
        }
    },

    confirmDelete(){
        this.setState({
            deleteConfirmation: true
        })
    },

    closeModal(){
        this.setState({
            deleteConfirmation: false
        })
    },

    deleteOne(){
        const {entity, id} = this.props.params
        if(entity && id && models[entity]){
            axios.delete(apiPath+entity+'/'+id)
                .then(response => {
                    console.log('Item deleted.')
                    comdisfoGlobals.skip_confirm = true
                    browserHistory.push('/'+entity+'/list')
                })
                .catch(() => {
                    this.setState({
                        error: {
                            message: 'Couldn\'t delete record.'
                        }
                    })
                });
        }
        this.closeModal()
    },

    render() {
        const {entity, id} = this.props.params,
            ep='/'+entity+'/',
            cStyle={ 
                color: '#FFCC80',
            },
            urlSearch = window.location.search ? window.location.search.substring(1) : ''
        let idx = 0,
            view = this.props.view

        function iicon(icon){
            return <i className={'glyphicon glyphicon-'+icon}></i>
        }
        function buttonLink(menu, idOrFun, iconOnly, style){
            const text = iconOnly ? null : menu.label
            if(isFunction(idOrFun)){
                return <li key={idx++}><a href="javascript:void(0)" onClick={idOrFun} style={style}>{iicon(menu.icon)} {text}</a></li>
            }else{
                return <li key={idx++}><Link to={ep+menu.id+'/'+idOrFun} activeStyle={cStyle} style={style}>{iicon(menu.icon)} {text}</Link></li>
            }
        }
        const views = menuItems.views
        const viewsList = ['list', 'cards', 'charts'].map(function(menu){
                            return buttonLink(views[menu], '', true)
                        })
        let actions = []

        if(id){
            const isNew = this.props.isNew || id==0
            if(!isNew){
                if(view==='edit'){
                    actions.push(buttonLink(menuItems.views.browse, id));
                }
                if(view==='comment'){
                    actions.push(buttonLink(menuItems.views.browse, id));
                }
                actions.push(buttonLink(menuItems.del, this.confirmDelete));
            }
        }

        if(entity && models[entity]){
            const delModal = this.state.deleteConfirmation ? (
                <Modal className="modal-dialog"
                    isOpen={this.state.deleteConfirmation}
                    onRequestClose={this.closeModal}
                    style={{content:{position:'absolute',top:'calc(50% - 200px)',left:'calc(50% - 150px)',height:'200px',width:'300px'}}}>
                        <div>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button  onClick={this.closeModal} className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                    <h4 className="modal-title">Delete item</h4>
                                </div>
                                <div className="modal-body">
                                    Do you really want to delete the {models[entity].name}?
                                </div>
                                <div className="modal-footer">
                                    <button key="bDelCancel" onClick={this.closeModal} className="btn btn-default" data-dismiss="modal">{i18n_actions.cancel}</button>
                                    <button key="bDelOK" onClick={this.deleteOne} className="btn btn-info" data-dismiss="modal">{i18n_actions.ok}</button>
                                </div>
                            </div>
                        </div>
                </Modal>
                ):null

            return (
              <div className="cdfo-toolbar">
                <ul role="nav" className="cdfo-nav-pills pull-left">
                    {viewsList}
                </ul>
                <ul role="nav" className="cdfo-nav-pills pull-left">
                    {buttonLink(menuItems.new, '')}
                </ul>
                <ul role="nav" className="cdfo-nav-pills pull-left"
                    style={{minWidth:'220px'}}>
                        {actions}
                        <li/>
                </ul>

                <div className="clearfix"/>

                {delModal}
            
              </div>
            )
        }
        return null
    }

})
