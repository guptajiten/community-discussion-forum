import React from 'react'
import {Link} from 'react-router'

import format from '../utils/format'
import {i18n_msg} from '../i18n/i18n'

import FieldLabel from './FieldLabel'

// - components:
// - date
import Datepicker from 'react-datepicker'
import moment from 'moment'
// - image & documents

function emHeight(f){
	let fh = parseInt(f.height || 2, 10);
	if(fh<2){
		fh=2;
	}
	return Math.trunc(fh*1.6);
}

function createMarkup(d) {
	return {__html: d?d.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>'):''}
}

function createOption(opt){
	return <option key={opt.id} value={''+opt.id}>{opt.text}</option>
}

export default React.createClass({

	propTypes: {
		meta: React.PropTypes.object.isRequired,
		callbacks: React.PropTypes.object,
		value: React.PropTypes.any, // field value
		label: React.PropTypes.string, //override label in meta
		readOnly: React.PropTypes.bool, //override label in meta
	},

	getInitialState: function() {
		return {
			help: false
		}
	},

	_fieldElem(f, d, cbs){
		// - return the widget needed for the specific field type
		if(f.type==='boolean'){
			return <input 
						id={f.id} 
						key={f.id} 
						ref='e'
						type="checkbox" 
						checked={d?true:false}
						onChange={cbs.change}
				    />
		}else if(f.type==='button'){
			return <input 
						id={f.id} 
						key={f.id} 
						value={f.value} 
						ref='e'
						type="button"
						className="btn btn-info"
						onClick={cbs.fieldClick}
				    />
		}else if(f.type==='multipletextmultiline'){ // && f.height>1
			if(d && d.length > 0){
				return d.map(onecom => {
					return <div className="past-comment-text">
						{onecom.comment?onecom.comment:''}
					</div>
				});
			}
			else{
				return ""
			}
		}else if(f.type==='textmultiline' || f.type==='json'){ // && f.height>1
			return <textarea 
						id={f.id} 
						key={f.id} 
						ref='e'
						rows={f.height} 
						className="form-control" 
						value={d?d:''} 
						onChange={cbs.change}
					/>
		}else if(f.type==='lov'||f.type==='list'){
			let opts

			if(f.list){
				opts = f.list.map(createOption)
			}else{
				const optVal = {
					id:f.id+'loading', 
					text: i18n_msg.loading
				}
				opts = [createOption(optVal)]
				f.list = [optVal]
			}
			return <select 
						id={f.id} 
						key={f.id}
						ref='e' 
						className="form-control" 
						value={d || ''}
						onChange={cbs.change}
					>
						<option/>
						{opts}
					</select>

		}else if(f.type==='date'){
			return <Datepicker
						id={f.id} 
						key={f.id}
						ref='e' 
						className="form-control" 
						selected={d ? moment(d, "YYYY-MM-DD") : null}
						onChange={this.getDateFieldChange(f.id)}
					/>
		}
		let inputType
		if(f.type==='integer' || f.type==='decimal'){
			inputType = 'number'
		}else{  //if(f.type==='email'){
			inputType = 'text'
		}
		
		return <input 
				id={f.id} 
				ref='e'
				type={inputType} 
				value={d?d:''}
				onChange={cbs.change}
				className="form-control"
			/>

	},

	_fieldElemReadOnly(f, d, d_id,cbs=null){
		// - return the formated field value
		let fw

		if(f.type==='textmultiline'){
			const height = emHeight(f)+'em'
			return <div key={f.id} className="disabled cdfo-rdonly" style={{height:height}}
					dangerouslySetInnerHTML={createMarkup(d)}
				/> 
		}else if(f.type==='multipletextmultiline'){ // && f.height>1
			if(d && d.length > 0){
				return d.map(onecom => {
					return <div style={{padding:'15px 10px',margin:'20px 0 0 0',border:'1px solid #ccc'}}>
						{onecom.comment?onecom.comment:''}
					</div>
				});
			}
			else{
				return ""
			}
		}else if(f.type==='button'){
			return <input 
						id={f.id} 
						key={f.id} 
						value={f.value} 
						ref='e'
						type="button"
						className="btn btn-info"
						onClick={cbs.fieldClick}
				    />
		}else if(f.type==='lov' && f.entity){
			fw = <Link to={'/'+f.entity+'/browse/'+d_id}>{format.fieldValue(f, d)}</Link>
		}else {
			fw = format.fieldValue(f, d)
		}
		return (
			<div key={f.id} className="disabled cdfo-rdonly">
				{fw}
			</div>
		)
	},

	clickHelp(){
		this.setState({
			help: !this.state.help
		})
	},

 	render() {
		const f = this.props.meta || {type: 'text'},
			readOnly = this.props.readOnly || f.readOnly,
			cbs = this.props.callbacks || {},
			value = this.props.value || null,
			valueId = this.props.valueId || null,
			invalid = this.state.invalid,
			label = this.props.label || f.label

		return (
			<div className={'cdfor-fld'+(invalid?' has-error':'')} style={{width: (f.width || 100)+'%'}}>

				<FieldLabel label={label} 
					field={f}
					readOnly={readOnly}
					clickHelp={this.clickHelp}/>

				{f.help && this.state.help ? <div className="help-block"><i>{f.help}</i></div> : null}

				{readOnly ? this._fieldElemReadOnly(f, value, valueId, cbs)
								 : this._fieldElem(f, value, cbs)}

 				{invalid ? <div className="text-danger">{this.state.message}</div> : null}

			</div>
		)
	},

	getDateFieldChange(fid) {
		// - for fields of type date (using react-datepicker)
		return (v)=>{
			this.props.callbacks.change({
				target:{
					id: fid, 
					value: v ? v.format() : null
				}
			})
		}
	}
})
