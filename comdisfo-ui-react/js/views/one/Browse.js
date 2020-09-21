import axios from 'axios'
import React from 'react'
import { Link } from 'react-router'
import {apiPath} from '../../../config.js'

import {i18n_actions, i18n_validation, i18n_errors} from '../../i18n/i18n'
import dico from '../../utils/dico'
import oneRead from './one-read'
import Alert from '../../widgets/Alert'
import Field from '../../widgets/Field'
import Panel from '../../widgets/Panel'
import List from '../many/List'

export default React.createClass({

  viewId: 'browse',

  propTypes: {
    params: React.PropTypes.shape({
      entity: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired
    }).isRequired
  },

  mixins: [oneRead()],

  setDeltaField(fid, value){
		if (!this.delta){
			this.delta={}
		}
		this.delta[fid]=value
		this._dirty=true
	},

  fieldChange(evt) {
		const fid=evt.target.id,
			newData=JSON.parse(JSON.stringify(this.state.data||{}))
		let v = evt.target.value

		if(evt.target.type==='checkbox'){
			v=evt.target.checked
		}
		newData[fid]=v
		this.setDeltaField(fid, v)
		this.setState({data: newData})
  },
  
  fieldClick(evt) {
    const {entity, id} = this.props.params
		const fid=evt.target.id,
		newData=JSON.parse(JSON.stringify(this.state.data||{}))
    let v = evt.target.value

    const mid = this.model.id;



    const data = "Harcoded comment"
    let url = apiPath+'addcomment/'+ id

      axios.post(url, newData)
      .then(response => {
        newData[fid]=response
        this.setDeltaField(fid, response)
        this.setState({data: response})
      })
      .catch(function (error) {
        alert('Error adding a comment!')
        console.log(error);
    });
    
	},

  render() {
    const {id=0, entity=null} = this.props.params
    const m = this.model,
        data = this.state.data || {},
        cbs = {
          change: this.fieldChange,
          click: this.fieldClick
        },
        title = dico.dataTitle(m, data, false)

    function fnFieldReadOnly(f){
      if(f){
        const isLOV = f.type==='lov';
        const attr = isLOV ? f.id+'_txt' : f.id
        return (
          (f.id==='newcomment')?
          (<Field 
            key={f.id} 
            meta={f} 
            value={data[attr]} 
            valueId={isLOV?data[f.id]:null}
            readOnly={false}
            callbacks={cbs}
            entity={entity}
          />):
          (<Field 
            key={f.id} 
            meta={f} 
            value={data[attr]} 
            valueId={isLOV?data[f.id]:null}
            readOnly={true}
            entity={entity}
          />)          
        )
      }
      return null
    }

    if(!m){
      return <Alert title="Error" message={i18n_errors.badEntity.replace('{0}', entity)}/>
    }else{
        return ( 
        <div className="comdisfo">

          <h2 className="cdfo-page-title">{title}</h2>

          <div className="cdfo-one-edit">

                {this.state.error ? (
                    <Alert title="Error" message={this.state.error.message}/>
                  ):(
                    <div className="cdfor-pnls">

                      {m.groups ? (
                          m.groups.map(function(g, idx){
                            const groupFields = dico.fieldId2Field(g.fields, m.fieldsH)
                            return (
                              <Panel key={g.id||('g'+idx)} title={g.label || gtitle || ''} width={g.width}>
                                <div className="cdfor-fset">
                                  {groupFields.map(fnFieldReadOnly)}
                                </div>
                              </Panel>
                            )
                          })
                      ) : (
                        <Panel key="pOne" title={title}>
                          <div className="cdfor-fset"> 
                            {m.fields.map(fnFieldReadOnly)}
                          </div>
                        </Panel>
                      )}

                      {m.collections ? (
                        m.collections.map((c, idx)=>{
                          return (
                            <Panel title={c.title} key={'collec_'+c.id}>
                              <List key={'collec'+idx}
                                params={this.props.params} 
                                paramsCollec={c}
                                style={{width:'100%'}}
                                location={this.props.location}
                              />
                            </Panel>
                          )
                        })
                      ) : null}
                    </div>
                  )
                }

								<Panel key="formButtons">
									<div className="cdfor-buttons">
										<button className="btn btn-info" onClick={this.fieldClick}><i className="glyphicon glyphicon-comment"></i> {i18n_actions.comment}</button>
										<span className="">{this.state.invalid ? i18n_validation.incomplete : null}</span>
										{this.state.error ? i18n_validation.incomplete : null}
									</div>
								</Panel>
          </div>
        </div>
        )      
    }
  }

})
