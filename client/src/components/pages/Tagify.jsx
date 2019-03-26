import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
 
const KeyCodes = {
  comma: 188,
  enter: 13,
};
 
const delimiters = [KeyCodes.comma, KeyCodes.enter];
 
export default class Tag extends React.Component {
    constructor(props) {
        super(props);
 
        this.state = {
            tags: [
                { id: "food", text: "food" },
                { id: "makeup", text: "makeup" },
                { id: "vegan", text: "vegan" }
             ],
            suggestions: [
                { id: 'makeup', text: 'makeup' },
                { id: 'vintage', text: 'vintage' },
                { id: 'dresses', text: 'dresses' },
                { id: 'accesories', text: 'accesories' },
                { id: 'salon', text: 'salon' },
                { id: 'clothes', text: 'clothes' },
                { id: 'murals', text: 'murals' },
                { id: 'baby', text: 'baby' },
                { id: 'shoes', text: 'shoes' },
                { id: 'mexican', text: 'mexican' },
                { id: 'soap', text: 'soap' },
                { id: 'wedding', text: 'wedding' }
             ]
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }
 
    handleDelete(i) {
        const { tags } = this.state;
        this.setState(state => ({
         tags: tags.filter((tag, index) => index !== i),
        }),() => {
            let tags = this.state.tags.map(tag => tag.text);
            this.props.handleTagChange(tags);
        });
    }
 
    handleAddition(tag) {
        console.log(tag)
        this.setState(state => ({ tags: [...state.tags, tag] }),() => {
            // let tags = this.state.tags.map(tag => tag);
            // let tagObject = {id: tag, text: tag}
            this.props.handleTagChange(tag);
        });
    }
 
    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
 
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        // re-render
        this.setState({ tags: newTags });
    }

    componentWillMount(){
        if(this.props.initialTags && this.props.initialTags.length > 0){
            let tags = this.props.initialTags;
            this.setState({tags})
        }
    }

    render() {
        const { tags, suggestions } = this.state;
        return (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center',margin:'5px'}}>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    placeholder='Tags that describe your bussines'
                    delimiters={delimiters} />
            </div>
        )
    }
};