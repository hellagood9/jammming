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
  }

  componentDidMount() {
    this.getTermFromLocaleStorageAndSetItsValueIntoReactState();
  }

  getTermFromLocaleStorageAndSetItsValueIntoReactState() {
    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    if (!accessTokenMatch) {
      localStorage.removeItem('term');
    }

    //this is an update

    let result = '';
    if (typeof localStorage.getItem('term') === 'string') {
       result = localStorage.getItem('term').length ? localStorage.getItem('term').replace(new RegExp('"', 'g'), '') : '';
    }

    this.setState({ term: result });
  }

  getTermFromReactAndSetIntoLocalStorage() {
    localStorage.setItem('term', JSON.stringify(this.state.term));
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  search() {
    this.getTermFromReactAndSetIntoLocalStorage();
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          value={this.state.term}
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          ref={node => this.input = node} />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
