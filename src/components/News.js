import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NewsItem from './NewsItem'
import Spinner from './Spinner';

export class News extends Component {
    urlBase = "https://newsapi.org/"

    static defaultProps = {
        country: 'in',
        pageSize: 9,
        category: "general",
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }


    constructor(){
        super();
        console.log("Hello constructor from new component")
        this.state = {
            articles : [],
            loading: false,
            page: 1,
            
        }
    }

    updateNews(){(async()=>{
        console.log("undateNews call")
        const url = this.urlBase +`v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ebcaf9a10c3c4b7d85b2ef6c5dca21a8&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: parsedData.articles, 
            totalResults: parsedData.totalResults,
            loading: false
        })
    })();
    }

    componentDidMount(){(async()=>{
        let url = this.urlBase +`v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ebcaf9a10c3c4b7d85b2ef6c5dca21a8&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: parsedData.articles, 
            totalResults: parsedData.totalResults,
            loading: false
        })
    
    })();
    }

     handlePrevClick = async ()=>{
        console.log("Previous Click")
        // let url = this.urlBase +`v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ebcaf9a10c3c4b7d85b2ef6c5dca21a8&pageSize=${this.props.pageSize}&page=${this.state.page - 1}`;
        // this.setState({loading: true})
        // let data = await fetch(url);
        // let parsedData = await data.json();
        // this.setState({
        //     page: this.state.page-1,
        //     articles: parsedData.articles,
        //     loading: false
        // })
        this.setState({page: this.state.page - 1 });
        this.updateNews()
    }

    handleNextClick = async ()=>{
        console.log("Next Click")
        // if (!(this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
        // let url = this.urlBase +`v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ebcaf9a10c3c4b7d85b2ef6c5dca21a8&pageSize=${this.props.pageSize}&page=${this.state.page + 1}`;
        // this.setState({loading: true})
        // let data = await fetch(url);
        // let parsedData = await data.json();
        // this.setState({
        //     page: this.state.page+1,
        //     articles: parsedData.articles,
        //     loading: false
        // })}
        this.setState({page: this.state.page + 1 });
        this.updateNews()
    }

    render() {
        console.log('render...')
        return (
            <div className="container my-3">
                <h1 className="text-center" style={{margin: '40px 0px'}}>News Monkey - Top Headlines</h1>
                {this.state.loading && <Spinner/>}
                <div className="row"> 
                {!this.state.loading && this.state.articles.map((element)=>{
                    return <div key={element.url} className="col-md-4">
                    <NewsItem  title={element.title?element.title.slice(0,50):""} description={element.description?element.description.slice(0,60):""} imageUrl = {element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
                })}
                
                </div>
                <div className="container">
                <div className="d-flex justify-content-between">
                <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>	&larr; Previous</button>
                <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
                
                </div>
            </div>
        )
    }
}

export default News
