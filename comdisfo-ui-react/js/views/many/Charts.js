import React from 'react'

import { i18n_charts } from '../../i18n/i18n'
import models from '../../../models/all_models'
import dico from '../../utils/dico'
import Alert from '../../widgets/Alert'
import Chart from './Chart'


export default React.createClass({

    viewId: 'charts',

    propTypes: {
        params: React.PropTypes.shape({
            entity: React.PropTypes.string.isRequired
        }),
    },

    render: function () {
        const e = this.props.params.entity,
            m = models[e]
    
        if(m){
            const title = m.title || m.label,
                chartFields = dico.getFields(m).filter(dico.fieldInCharts)
            return (

                <div className="comdisfo cdfor-many-charts">
                    
                    <h2 className="cdfo-page-title">{title}</h2>
                    
                    <div className="comdisfo cdfor-many-charts">
                        {chartFields.length ? chartFields.map(function(f){
                            return <Chart entity={e} key={'c-'+f.id} field={f} title={f.label} className="panel-default"/> 
                        }) : (
                            <Alert title="No data" message={i18n_charts.nocharts} type="warning"/>
                        )} 
                    </div>

                </div>
            )
        }else{
            return <Alert title="Error" message={'Invalid input parameter "'+e+'".'}/>
        }
    }
})
