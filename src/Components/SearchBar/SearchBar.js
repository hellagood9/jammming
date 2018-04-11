import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    if (!accessTokenMatch) {
      localStorage.removeItem('term');
    } else {
      let termWithoutQuotes = localStorage.getItem('term').replace(new RegExp('"', 'g'), '');
      this.setState({ term: termWithoutQuotes });
    }
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  handleKeyDown(event) {
    if (this.state.term === '') {
      return;
    }

    if (event.keyCode === 13) {
      this.props.onSearch(this.state.term);
      this.search();
    }
  }

  search() {
    if (this.state.term === '') {
      return;
    }

    localStorage.setItem('term', JSON.stringify(this.state.term));
    this.props.onSearch(this.state.term);
    this.setState({ term: '' });
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          value={this.state.term}
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyDown={this.handleKeyDown} />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
