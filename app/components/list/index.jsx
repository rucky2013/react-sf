import React from 'react';
import { Router, Route, Link,IndexLink , hashHistory, IndexRoute } from 'react-router';
import $ from "jquery";
export default class List extends React.Component{
    constructor(){
        super();
        this.state ={
            page:1,
            quelist:[],
            loading:true,
            loadingMore:false
        }
        this.scrollUpdate = this._scrollUpdate.bind(this);
    }
    _scrollUpdate(e){
        var scrollTop =  $(window).scrollTop();   
    　　var scrollHeight = $(document).height();       　　
        var windowHeight =  $(window).height();  
            if (scrollTop + windowHeight >= scrollHeight -100 && this.state.loadingMore) {


            this.setState({
                loadingMore:false,
                loading:true
            });

            $.ajax({
                url: 'http://127.0.0.1:3000',
                type: 'GET',
                data: {
                    page: this.state.page,
                },
                success: function(listData) {
                    // this.isMounted() && 
                    if (listData) {
                        var quelists = this.state.quelist.concat(listData);
                        var $page = this.state.page + 1;
                        this.setState({
                            quelist:quelists,
                            loading:false,
                            page:$page,
                            loadingMore:true
                        })
                }
            
                }.bind(this)
            })
        }
    }
    componentDidMount(){
        $.ajax({
            url: 'http://127.0.0.1:3000',
            type: 'GET',
            data: {
                page: this.state.page
            },
            success: function(listData) {
                // if (this.isMounted()) {
                    this.setState({
                        quelist:listData,
                        page:(this.state.page + 1),
                        loading:false,
                        loadingMore:true
                    })
                // }
                
            }.bind(this)
        })
       window.addEventListener('scroll',this.scrollUpdate);
    }
    componentWillUnmount(){
        window.removeEventListener('scroll', this.scrollUpdate);
    }
    routerWillLeave(){
        window.removeEventListener('scroll', this.scrollUpdate);
    }
    render(){
         var _list = this.state.quelist.map(function(item,index){
        return(<li key={item.title.titleSrc + index}>
                    <div className="vote">
                        {item.votes}
                        <small>投票</small>
                    </div>
                    <div className="summary">
                        <Link className="summaryTitle" to ={`/question/${item.title.titleSrc}`}>
                            {item.title.content}
                        </Link>
                        <p className="user-time">{item.author}{item.time}</p>
                    </div>
                    <div className="view-answers">
                        <strong>{item.answers}</strong>/{item.views}
                    </div>
                </li>)
        }.bind(this));
        var isNone = !!this.state.loading ? "block" : "none";
        return (
            <div className="main">
            <ul>
                {_list}
            </ul>
            <div style={{display:isNone}} className='loading'> loading</div>
        </div>
        );
    }
    
}