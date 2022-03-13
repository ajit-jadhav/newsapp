import React, { Component } from "react";
import PropTypes from "prop-types";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import def_img from "./def_img.jpg";
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  urlBase = "https://newsapi.org/";

  static defaultProps = {
    country: "in",
    pageSize: 9,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitaliseFirstLEtter = (str) => {
    console.log(str);
    console.log(str.charAt(0).toUpperCase() + str.slice(1));
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  constructor(props) {
    super(props);
    console.log("Hello constructor from new component");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitaliseFirstLEtter(
      this.props.category
    )} - NewsMonkey`;
  }

  updateNews() {
      this.props.setProgress(10); 
    (async () => {
      console.log("undateNews call");
      const url =
        this.urlBase +
        `v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true });
      let data = await fetch(url);
      this.props.setProgress(30);
      let parsedData = await data.json();
      this.props.setProgress(70);
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false,
      });
      this.props.setProgress(100);
    })();
  }

  componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
    console.log("Previous Click");
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };

  handleNextClick = async () => {
    console.log("Next Click");
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };

  fetchMoreData = async () => {
    this.setState({page: this.state.page+1})
    console.log("undateNews call");
      const url =
        this.urlBase +
        `v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log(parsedData);
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults, 
      });
  };

  render() {
    console.log("render...");
    return (
      <>
        <h1 className="text-center" style={{ margin: "40px 0px" }}>
          News Monkey - Top {this.capitaliseFirstLEtter(this.props.category)}{" "}
          Headlines
        </h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!=this.state.totalResults}
          loader={<Spinner/>}
        >
        <div className="container">

        <div className="row">
          {this.state.articles.map((element) => {
            return (
              <div key={element.url} className="col-md-4">
                <NewsItem
                  title={element.title ? element.title.slice(0, 50) : ""}
                  description={
                    element.description ? element.description.slice(0, 60) : ""
                  }
                  imageUrl={element.urlToImage ? element.urlToImage : def_img}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div> 
            );
          })}
        </div>
        </div>

        </InfiniteScroll>

      </>
    );
  }
}

export default News;
