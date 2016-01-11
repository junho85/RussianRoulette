var NameBoxList = React.createClass({
    getInitialState: function() {
        return {
            value: 8,
            items: ['mouse', 'rabbit', 'tiger', 'elephant', 'fox', 'snake', 'dragon', 'turtle']
        };
    },
    handleChange: function(event) {

        function getRandomName() {
            var sampleNames = ['tiger', 'rabbit', 'mouse', 'horse', 'elephant', 'fox', 'snake', 'dragon'];

            var randomNumber = Math.floor(Math.random() * sampleNames.length);

            return sampleNames[randomNumber];
        }

        var beforeValue = this.state.value;
        var currentValue = event.target.value;

        var newItems;
        var diffValue = currentValue - beforeValue;
        if (diffValue < 0) {
            // remove
            for (var i=0; i<-diffValue; i++) {
                newItems = this.state.items.slice();
                newItems.splice(currentValue - i, 1);
            }
        } else if (diffValue > 0) {
            // add
            for (var i=0; i<diffValue; i++) {
                var newItem = getRandomName();
                newItems = this.state.items.concat(newItem);
            }
        }

        this.setState({
            value: event.target.value,
            items: newItems
        });
    },
    render: function() {
        var value = this.state.value;
        var data = this.state.items;
        var nameBoxNodes = data.map(function (row) {
            return (
                <div className="box col-md-2">
                    <input type="text" className="form-control" name="chamber" defaultValue={row} />
                </div>
            );
        });
        return (
            <div>
                <div id="numOfChamberBox" className="col-xs-2">
                    <input type="number" id="numOfChamber" className="form-control" value={value} onChange={this.handleChange} />
                </div>
                <div className="form-group line">
                    {nameBoxNodes}
                </div>
            </div>
        );
    }
});

React.render(
    <NameBoxList></NameBoxList>,
    document.getElementById('nameBox')
);