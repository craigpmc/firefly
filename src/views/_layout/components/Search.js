import React from 'react'
import { withRouter } from 'react-router-dom'
import Autosuggest from 'react-autosuggest'
import Algolia from 'algoliasearch'

let algolia = Algolia(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_APP_KEY)
let index = algolia.initIndex('posts')

class Search extends React.Component {
  constructor() {
    super()

    this._onChange = this._onChange.bind(this)
    this._fetchSuggestions = this._fetchSuggestions.bind(this)
    this._clearSuggestions = this._clearSuggestions.bind(this)
    this._onSuggestionSelected = this._onSuggestionSelected.bind(this)

    this.state = {
      value: '',
      suggestions: [],
    }

  }

  _onChange(event, params) {
    this.setState({
      value: params.newValue
    })
  }

  _fetchSuggestions({ value }) {
    value = value.trim().toLowerCase()

    if (value.length === 0) {
      this.setState({
        suggestions: []
      })
    } else {
      index.search(value, (err, content) => {
        this.setState({
          suggestions: content.hits
        })
      })
    }
  }

  _clearSuggestions() {
    this.setState({
      suggestions: []
    })
  }

  _onSuggestionSelected(event, attrs) {
    this.props.history.push('/posts/'+attrs.suggestion.slug)
  }

  render() {

    let inputProps = {
      placeholder: 'Type to search',
      value: this.state.value,
      onChange: this._onChange,
    }

    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this._fetchSuggestions}
        onSuggestionsClearRequested={this._clearSuggestions}
        renderSuggestion={ (x) => x.title }
        getSuggestionValue={ (x) => x.title }
        onSuggestionSelected={this._onSuggestionSelected}
        inputProps={inputProps}
        theme={styles}
      />
    )

  }
}

// more classes: https://github.com/moroshko/react-autosuggest#themeProp
let styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  suggestionsContainerOpen: {
    border: '1px solid',
    position: 'absolute',
    top: '2rem',
    left: 0,
  },
  suggestionsList: {
    padding: 0,
    margin: 0,
  },
  suggestion: {
    padding: '.5rem',
    listStyle: 'none',
    minWidth: '100px',
    background: 'white',
  },
  suggestionHighlighted: {
    background: '#eee',
  },
}

export default withRouter(Search)